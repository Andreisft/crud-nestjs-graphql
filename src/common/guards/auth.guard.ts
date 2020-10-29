import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { Reflector } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { verify } from "jsonwebtoken";
import { CommonService } from "../common.service";
import { Coach } from "../../coaches/coach.entity";

interface JwtPayload {
  id: number;
}

@Injectable()
export class AuthGuard implements CanActivate {
  private SECRET_KEY = this.configService.get<string>("SECRET_KEY");
  constructor(
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
    private readonly commonService: CommonService
  ) {}

  async canActivate(context: ExecutionContext) {
    const gqlExecutionContext = GqlExecutionContext.create(context);

    const auth = this.reflector.get<boolean | undefined>(
      "auth",
      context.getHandler()
    );

    if (!auth) return true;

    const req = gqlExecutionContext.getContext().req;

    const headers = req.headers;

    const token = headers["authorization"];

    if (!token) throw new UnauthorizedException();

    try {
      const { id } = verify(token, this.SECRET_KEY) as JwtPayload;

      const user = await this.commonService.findById(id, Coach);

      if (!user) throw new UnauthorizedException();

      req.user = user;

      return true;
    } catch (err) {
      throw new UnauthorizedException();
    }
  }
}
