import {
	BaseEntity,
	Column,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm'
import { PostCard } from './PostCard'
import { Vote } from './Vote'

@Entity()
export class User extends BaseEntity {
	@PrimaryGeneratedColumn()
	id!: number

	@Column({ length: 100 })
	firstName!: string

	@Column({ length: 100 })
	lastName!: string

	@Column({ length: 100 })
	avatar!: string

	@Column({ unique: true, length: 100 })
	username!: string

	@Column()
	password!: string

	@Column({ default: 0 })
	tokenVersion!: number

	@OneToMany((_to) => PostCard, (postCard) => postCard.user)
	postCards!: PostCard[]

	@OneToMany((_to) => Vote, (vote) => vote.user)
	votes!: Vote[]
}
