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

import { Body, Controller, Delete, Get, Headers, Param, Patch, Post, Query } from '@nestjs/common';
import { UserService } from 'database/services/user/user.service';
import { AutomationRobotRepository } from '../repositories/automation.robot.repository';
import { RobotCreateRo } from '../ros/robot.create.ro';
import { AutomationService } from '../services/automation.service';

@Controller('nest/v1/robots')
export class RobotController {
  constructor(
    private readonly automationRobotRepository: AutomationRobotRepository,
    private readonly automationService: AutomationService,
    private readonly userService: UserService,
  ) { }

  @Get(['/'])
  getRobotListByResourceId(@Query('resourceId') resourceId: string) {
    return this.automationRobotRepository.getRobotListByResourceId(resourceId);
  }

  @Post(['/'])
  async createRobot(@Body() robot: RobotCreateRo, @Headers('cookie') cookie: string) {
    const user = await this.userService.getMe({ cookie });
    await this.automationService.checkCreateRobotPermission(robot.resourceId);
    return this.automationRobotRepository.createRobot(robot, user.userId);
  }

  @Get(['/:robotId'])
  getDatePack(@Param('robotId') robotId: string,) {
    return this.automationRobotRepository.getRobotDetailById(robotId);
  }

  @Delete(['/:robotId'])
  async deleteRobot(@Param('robotId') robotId: string, @Headers('cookie') cookie: string) {
    const { userId } = await this.userService.getMe({ cookie });
    return this.automationRobotRepository.deleteRobot(robotId, userId);
  }

  @Patch(['/:robotId'])
  async updateRobot(
    @Param('robotId') robotId: string,
    @Body() robot: { name?: string, description?: string },
    @Headers('cookie') cookie: string
  ) {
    const { userId } = await this.userService.getMe({ cookie });
    const { name, description } = robot;
    if (name) {
      return this.automationRobotRepository.updateRobot(robotId, { name }, userId);
    }
    if (description) {
      return this.automationRobotRepository.updateRobot(robotId, { description }, userId);
    }
    return { ok: false, msg: 'nothing changed' };
  }

  @Get('/:robotId/base-info')
  getRobotBaseInfo(@Param('robotId') robotId: string) {
    return this.automationRobotRepository.getRobotBaseInfoByIds([robotId]);
  }

  @Get(['/:robotId/trigger'])
  getRobotTrigger(@Param('robotId') robotId: string) {
    return this.automationRobotRepository.getRobotTriggerById(robotId);
  }

  @Get(['/:robotId/actions'])
  getRobotActions(@Param('robotId') robotId: string) {
    return this.automationRobotRepository.getRobotActionsById(robotId);
  }

  @Post(['/:robotId/active'])
  async activeRobot(@Param('robotId') robotId: string, @Headers('cookie') cookie: string) {
    const user = await this.userService.getMe({ cookie });
    return this.automationService.activeRobot(robotId, user);
  }

  @Post(['/:robotId/deactive'])
  async deActiveRobot(@Param('robotId') robotId: string, @Headers('cookie') cookie: string) {
    const user = await this.userService.getMe({ cookie });
    return this.automationRobotRepository.deActiveRobot(robotId, user.userId);
  }
}
