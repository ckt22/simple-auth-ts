import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity
  } from 'typeorm';
  
  export enum UserType {
    regular = 'regular',
    admin = 'admin',
  }

  export enum AuthSource {
    email = 'email',
    facebook = 'facebook',
    google = 'google'
  }

  export class CreateUserDto {
    @Column()
    email?: string;
  
    @Column({ select: false })
    password?: string;

    @Column('boolean', { default: true })
    isEmailVerified: boolean;

    @Column({ default: null })
    facebook?: string;

    @Column({ default: null })
    google?: string;

    @Column()
    token?: string;

    @Column({ default: null })
    emailVerificationCode?: string;

    @Column('enum', {
      enum: Object.keys(UserType) as string[],
      default: UserType.regular
    })
    userType: UserType;

    @Column('enum', {
        enum: Object.keys(AuthSource) as string[],
    })
    authSource: AuthSource;

    @Column('json')
    profile?: any;

  }
  
  @Entity({ name: 'users' })
  export class User extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    email?: string;
  
    @Column({ select: false, default: null })
    password?: string;

    @Column({ default: null })
    emailVerificationCode?: string;

    @Column('boolean', { default: true })
    isEmailVerified: boolean;

    @Column({ default: null })
    facebook?: string;

    @Column({ default: null })
    google?: string;

    @Column({ default: null })
    token?: string;
  
    @Column('enum', {
      enum: Object.keys(UserType) as string[],
      default: UserType.regular
    })
    userType: UserType;

    @Column('enum', {
        enum: Object.keys(AuthSource) as string[],
    })
    authSource: AuthSource;

    @Column('json', { default: null })
    profile?: any;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
}
  