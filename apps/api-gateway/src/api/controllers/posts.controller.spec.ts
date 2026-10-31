import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PostsController } from './posts.controller';

describe('PostsController', () => {
  let controller: PostsController;
  let postsClient: {
    send: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    postsClient = {
      send: vi.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [
        {
          provide: 'POSTS_SERVICE',
          useValue: postsClient,
        },
      ],
    }).compile();

    controller = module.get<PostsController>(PostsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all users', async () => {
    const posts = [
      { id: 1, authorId: 1, caption: 'First post', imageUrl: 'image1.jpg' },
      { id: 2, authorId: 2, caption: 'Second post', imageUrl: 'image2.jpg' },
    ];

    postsClient.send.mockReturnValue(of(posts));

    const result = await controller.findAll();

    expect(postsClient.send).toHaveBeenCalledWith(
      { cmd: 'posts.findAll' },
      {},
    );
    expect(result).toEqual(posts);
  });

  it('should return a post by ID', async () => {
    const post = {
      id: 1,
      authorId: 1,
      caption: 'First post',
      imageUrl: 'image1.jpg',
    };

    postsClient.send.mockReturnValue(of(post));

    const result = await controller.findOne(1);

    expect(postsClient.send).toHaveBeenCalledWith(
      { cmd: 'posts.findOne' },
      { id: 1 },
    );
    expect(result).toEqual(post);
  });

  it('should create a post', async () => {
    const data = {
      authorId: 1,
      caption: 'My new post',
      imageUrl: 'image.jpg',
    };

    const createdPost = {
      id: 1,
      ...data,
    };

    postsClient.send.mockReturnValue(of(createdPost));

    const result = await controller.create(data);

    expect(postsClient.send).toHaveBeenCalledWith(
      { cmd: 'posts.create' },
      data,
    );
    expect(result).toEqual(createdPost);
  });

  it('should update a post', async () => {
    const data = {
      caption: 'Updated caption',
      imageUrl: 'updated-image.jpg',
    };

    const updatedPost = {
      id: 1,
      authorId: 1,
      ...data,
    };

    postsClient.send.mockReturnValue(of(updatedPost));

    const result = await controller.update(1, data);

    expect(postsClient.send).toHaveBeenCalledWith(
      { cmd: 'posts.update' },
      {
        id: 1,
        ...data,
      },
    );
    expect(result).toEqual(updatedPost);
  });

  it('should delete a post', async () => {
    postsClient.send.mockReturnValue(of(undefined));

    const result = await controller.delete(1);

    expect(postsClient.send).toHaveBeenCalledWith(
      { cmd: 'posts.delete' },
      { id: 1 },
    );
    expect(result).toBeUndefined();
  });
});