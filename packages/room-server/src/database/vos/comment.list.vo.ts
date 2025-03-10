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

import { ApiProperty } from '@nestjs/swagger';
import { CommentDto } from '../dtos/comment.dto';
import { UnitBaseInfoDto } from '../dtos/unit.base.info.dto';

export class CommentListVo {
  @ApiProperty({
    type: [CommentDto],
    description: 'record comment list',
  })
    comments!: CommentDto[];

  @ApiProperty({
    type: [CommentDto],
    description: 'list of units involved in record comments',
  })
    units!: UnitBaseInfoDto[];
}
