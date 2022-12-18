import {
    Entity,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    PrimaryGeneratedColumn,
    DeleteDateColumn,
  } from 'typeorm';
  
  export enum OwnerType {
    admin = 'admin',
    user = 'user',
  }
  
  @Entity({ name: 'sessions' })
  export class Session {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column('enum', {
      enum: Object.keys(OwnerType) as string[],
    })
    ownerType: OwnerType;
  
    @Column()
    expiredAt: Date;
  
    @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
  
    @UpdateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
  
    @DeleteDateColumn()
    deletedAt: Date;
  }
  