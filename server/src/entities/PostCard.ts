import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'
import { User } from './User'
import { Vote } from './Vote'

@Entity()
export class PostCard extends BaseEntity {
	@PrimaryGeneratedColumn()
	id!: number

	@Column({ length: 100 })
	image!: string

	@Column()
	content!: string

	@Column()
	userId!: number

	@CreateDateColumn()
	createdAt!: Date

	@UpdateDateColumn()
	updatedAt!: Date

	@ManyToOne((_to) => User, (user) => user.postCards)
	user!: User

	@OneToMany((_to) => Vote, (vote) => vote.postCard)
	votes!: Vote[]
}
