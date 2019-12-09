import { IsDate, IsString } from 'class-validator';
import { Schema } from 'mongoose';

export class Achievement {
  @IsString()
  avatar: string;

  @IsString()
  name: string;

  @IsString()
  short: string;

  @IsString()
  description: string;

  @IsString()
  relatedPullRequest: string;

  @IsDate()
  grantedOn: Date;
}

export const AchievementSchema = new Schema({
  avatar: { type: String, required: true },
  name: { type: String, required: true },
  short: { type: String, required: true },
  description: { type: String, required: true },
  relatedPullRequest: { type: String, required: true },
  grantedOn: { type: Date, required: true }
}, {
  collation: { locale: 'en_US', strength: 2 }
});
