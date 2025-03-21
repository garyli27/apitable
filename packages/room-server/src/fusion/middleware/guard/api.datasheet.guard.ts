/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { DATASHEET_HTTP_DECORATE, USER_HTTP_DECORATE } from '../../../shared/common';
import { ApiException } from '../../../shared/exception';
import { UnitMemberRepository } from '../../../database/repositories/unit.member.repository';
import { ApiTipConstant } from '@apitable/core';

/**
 * Guards are executed after each middleware, but before any interceptor or pipe.
 * datasheet info validate
 * the path start with:/fusion/v1/datasheets
 */
@Injectable()
export class ApiDatasheetGuard implements CanActivate {

  constructor( private readonly memberRepository: UnitMemberRepository) {
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    // check if the datasheet exists
    if (!request.params || !request.params.datasheetId) {
      throw ApiException.tipError(ApiTipConstant.api_datasheet_not_exist);
    }
    // works for datasheet related APIs
    const datasheet = request[DATASHEET_HTTP_DECORATE];
    if (!datasheet) {
      throw ApiException.tipError(ApiTipConstant.api_datasheet_not_exist);
    }
    const spaceId = datasheet.spaceId;
    const user = request[USER_HTTP_DECORATE];
    const spaceIds = await this.memberRepository.selectSpaceIdsByUserId(user.id);
    // no permission of the space
    if (!spaceIds.length || !spaceIds.includes(spaceId)) {
      throw ApiException.tipError(ApiTipConstant.api_datasheet_not_visible);
    }
    return true;
  }
}
