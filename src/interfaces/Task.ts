import { IsNotEmpty, Length } from 'class-validator';
import { v4 as uuidv4 } from 'uuid';

abstract class Base {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  constructor() {
    this.id = uuidv4();
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}

export interface TaskProps {
  title: string;
  description: string;
  dueDate: Date;
  done: boolean;
}

interface UpdateTaskProps extends TaskProps {
  id: string;
}

export class Task extends Base implements TaskProps {
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  @Length(5)
  description: string;
  @IsNotEmpty()
  dueDate: Date;
  @IsNotEmpty()
  done: boolean;

  constructor({ title, description, dueDate, done }: TaskProps) {
    super();
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.done = Boolean(done);
  }


  update({ id, title, description, dueDate, done }: UpdateTaskProps): Task {
    console.log('Updating task', this, id);
    if (id && id !== this.id) {
      this.id = id;
    }
    if (title && title !== this.title) {
      this.title = title;
    }
    if (description && description !== this.description) {
      this.description = description;
    }
    if (dueDate && dueDate !== this.dueDate) {
      this.dueDate = dueDate;
    }
    if (Boolean(done) !== this.done) {
      this.done = Boolean(done);
    }

    this.updatedAt = new Date();

    return this;
  }
}
