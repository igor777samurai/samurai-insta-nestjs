import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UsersController } from './users.controller';

describe('UsersController', () => {
  let controller: UsersController;
  let usersClient: {
    send: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    usersClient = {
      send: vi.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: 'USERS_SERVICE',
          useValue: usersClient,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user', async () => {
    const data = {
      name: 'Alex',
      email: 'alex@example.com',
    };

    const createdUser = {
      id: 1,
      ...data,
    };

    usersClient.send.mockReturnValue(of(createdUser));

    const result = await controller.create(data);

    expect(usersClient.send).toHaveBeenCalledWith(
      { cmd: 'users.create' },
      data,
    );
    expect(result).toEqual(createdUser);
  });

  // READ ALL
  it('should return all users', async () => {
    const users = [
      { id: 1, name: 'Alex', email: 'alex@example.com' },
      { id: 2, name: 'John', email: 'john@example.com' },
    ];

    usersClient.send.mockReturnValue(of(users));

    const result = await controller.findAll();

    expect(usersClient.send).toHaveBeenCalledWith(
      { cmd: 'users.findAll' },
      {},
    );
    expect(result).toEqual(users);
  });

  // READ ONE
  it('should return a user by ID', async () => {
    const user = {
      id: 1,
      name: 'Alex',
      email: 'alex@example.com',
    };

    usersClient.send.mockReturnValue(of(user));

    const result = await controller.findOne(1);

    expect(usersClient.send).toHaveBeenCalledWith(
      { cmd: 'users.findOne' },
      { id: 1 },
    );
    expect(result).toEqual(user);
  });

  // UPDATE
  it('should update a user', async () => {
    const data = {
      name: 'Alex Updated',
      email: 'alex.updated@example.com',
    };

    const updatedUser = {
      id: 1,
      ...data,
    };

    usersClient.send.mockReturnValue(of(updatedUser));

    const result = await controller.update(1, data);

    expect(usersClient.send).toHaveBeenCalledWith(
      { cmd: 'users.update' },
      {
        id: 1,
        data,
      },
    );
    expect(result).toEqual(updatedUser);
  });

  // DELETE
  it('should delete a user', async () => {
    usersClient.send.mockReturnValue(of(undefined));

    const result = await controller.remove(1);

    expect(usersClient.send).toHaveBeenCalledWith(
      { cmd: 'users.delete' },
      { id: 1 },
    );
    expect(result).toBeUndefined();
  });
});
