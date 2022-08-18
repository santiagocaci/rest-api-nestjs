import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Bookmark } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { BookmarkService } from './bookmark.service';
import { CreateBookmarkDto, UpdateBookmarkDto } from './dto';

@UseGuards(JwtGuard)
@Controller('bookmark')
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) {}

  @Get()
  getBookmarks(@GetUser('id') userId: number) {
    return this.bookmarkService.getBookmarks(userId);
  }

  @Get(':id')
  async getBookmark(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
  ) {
    const bookmark = await this.bookmarkService.getBookmark(userId, bookmarkId);

    if (!bookmark) throw new NotFoundException();
    return bookmark;
  }

  @Post()
  createBookmark(
    @GetUser('id') userId: number,
    @Body() dto: CreateBookmarkDto,
  ) {
    return this.bookmarkService.createBookmark(userId, dto);
  }

  @Patch(':id')
  async updateBookmark(
    @GetUser('id') userId: number,
    @Body() dto: UpdateBookmarkDto,
    @Param('id', ParseIntPipe) bookmarkId: number,
  ) {
    const bookmark = await this.bookmarkService.updateBookmark(
      userId,
      dto,
      bookmarkId,
    );

    if (!bookmark) throw new ForbiddenException('Access to resources denied');

    return bookmark;
  }

  @Delete(':id')
  async deleteBookmark(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
  ) {
    const bookmarkDeleted = await this.bookmarkService.deleteBookmark(
      userId,
      bookmarkId,
    );

    if (!bookmarkDeleted)
      throw new ForbiddenException('Access to resources denied');

    return bookmarkDeleted;
  }
}
