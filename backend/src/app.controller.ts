import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Todo } from './todo.schema';

@Controller('todos')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  async createTodo(@Body() todo: Todo) {
    return this.appService.createTodoService(todo);
  }
  @Get()
  async getAllTodo() {
    return this.appService.getAllTodoService();
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.appService.getByIfTodoService(id);
  }

  @Put(':id')
  async updateTodo(@Param('id') id: string, @Body() todo: Todo) {
    return this.appService.updateTodoService(id, todo);
  }

  @Delete(':id')
  async deleteTodo(@Param('id') id: string) {
    return this.appService.deleteTodoService(id);
  }
}
