import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { DocumentService } from 'src/document/document.service';

@Injectable()
export class OwnerGuard implements CanActivate {

  constructor (private documentService: DocumentService) {
  }

  async canActivate(
    context: ExecutionContext,
  ):  Promise<boolean> {
    const loginFrom = context.switchToHttp().getRequest().user.login;
    const docId = context.switchToHttp().getRequest().params.id;
    return await this.documentService.isGoodOwner(docId, loginFrom);
  }
}
