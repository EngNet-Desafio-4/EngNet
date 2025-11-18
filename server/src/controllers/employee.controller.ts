import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  HttpCode,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { EmployeeService } from '../application/employee/employee.service';
import { EmployeeDto } from '../application/employee/dto/EmployeeDto';
import { JwtAuthGuard } from '../application/auth/guards/jwt.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: EmployeeDto) {
    return this.employeeService.create(dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.employeeService.getAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.employeeService.getByID(Number(id));
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() dto: EmployeeDto) {
    return this.employeeService.update(Number(id), dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.employeeService.deleteById(Number(id));
  }
}
