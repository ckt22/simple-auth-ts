import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn
  } from 'typeorm';
  
  export enum UserType {
    personal = 'personal',
    corporate = 'corporate',
  }

  export enum AuthSource {
    email = 'email',
    facebook = 'facebook',
    google = 'google'
  }
  
  @Entity({ name: 'users' })
  export class User {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    email: string;
  
    @Column({ select: false })
    password: string;
  
    @Column('enum', {
      enum: Object.keys(UserType) as string[],
    })
    userType: UserType;

    @Column('enum', {
        enum: Object.keys(AuthSource) as string[],
    })
    authSource: AuthSource;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
}
  