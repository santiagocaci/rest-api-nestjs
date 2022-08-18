import { Injectable } from '@nestjs/common';
import { Bookmark } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookmarkDto, UpdateBookmarkDto } from './dto';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}

  async getBookmarks(userId: number) {
    const bookmarks = await this.prisma.bookmark.findMany({
      where: {
        userId: userId,
      },
    });
    return bookmarks;
  }

  async getBookmark(
    userId: number,
    bookmarkId: number,
  ): Promise<Bookmark | null> {
    const bookmark = await this.prisma.bookmark.findFirst({
      where: {
        userId,
        id: bookmarkId,
      },
    });

    return bookmark;
  }

  async createBookmark(userId: number, dto: CreateBookmarkDto) {
    const bookmarCreated = await this.prisma.bookmark.create({
      data: {
        userId,
        ...dto,
      },
    });
    return bookmarCreated;
  }

  async updateBookmark(
    userId: number,
    dto: UpdateBookmarkDto,
    bookmarkId: number,
  ): Promise<Bookmark | null> {
    const bookmark = await this.prisma.bookmark.findUnique({
      where: {
        id: bookmarkId,
      },
    });

    if (!bookmark || bookmark.userId !== userId) return null;

    const bookmarkUpdated = await this.prisma.bookmark.update({
      where: {
        id: bookmarkId,
      },
      data: {
        ...dto,
      },
    });

    return bookmarkUpdated;
  }

  async deleteBookmark(
    userId: number,
    bookmarkId: number,
  ): Promise<Bookmark | null> {
    const bookmark = await this.prisma.bookmark.findUnique({
      where: {
        id: bookmarkId,
      },
    });

    if (!bookmark || bookmark.userId !== userId) return null;

    const bookmarkDeleted = await this.prisma.bookmark.delete({
      where: {
        id: bookmarkId,
      },
    });

    return bookmarkDeleted;
  }
}
