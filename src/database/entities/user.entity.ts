import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity
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
  export class User extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    email: string;
  
    @Column({ select: false })
    password: string;

    @Column('boolean', { default: true })
    isEmailVerified: boolean;

    @Column({ default: null })
    facebook: string;

    @Column({ default: null })
    google: string;

    @Column()
    token: string;
  
    @Column('enum', {
      enum: Object.keys(UserType) as string[],
    })
    userType: UserType;

    @Column('enum', {
        enum: Object.keys(AuthSource) as string[],
    })
    authSource: AuthSource;

    @Column('json')
    profile: any;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
}
  