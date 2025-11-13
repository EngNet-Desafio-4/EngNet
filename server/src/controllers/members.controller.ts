import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { MembersService } from '../application/members/members.service';

@Controller('members')
export class MembersController {
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createMemberDto: any) {
    return { message: 'Member created', data: createMemberDto };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return { message: 'All members returned' };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return { message: `Member ${id} returned` };
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() updateMemberDto: any) {
    return { message: `Member ${id} updated`, data: updateMemberDto };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return { message: `Member ${id} deleted` };
  }
}
