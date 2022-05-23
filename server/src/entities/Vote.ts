import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm'
import { PostCard } from './PostCard'
import { User } from './User'

@Entity()
export class Vote extends BaseEntity {
	@PrimaryColumn()
	userId!: number

	@ManyToOne((_to) => User, (user) => user.votes)
	user!: User

	@PrimaryColumn()
	postCardId!: number

	@ManyToOne((_to) => PostCard, (postCard) => postCard.votes)
	postCard!: PostCard

	@Column()
	value!: number
}
