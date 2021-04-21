import { IAchievement, IUserAchievement } from './achievement.abstract';

export const optimusPrime: IAchievement = {
  name: 'optimus prime',
  check: function(pullRequest, shall) {
    if (isPrime(pullRequest.number)) {

      const achieve: IUserAchievement = {
        avatar: 'images/achievements/optimusPrime.achievement.jpeg',
        name: 'optimus prime',
        short: 'Fate rarely calls upon us at a moment of our choosing',
        description: [
          'Pull requests with prime numbers are very rare! yours was ',
          pullRequest.number
        ].join(''),
        relatedPullRequest: pullRequest.id
      };
      shall.grant(pullRequest.creator.username, achieve);
    }
  }
};

function isPrime(n) {

  // If n is less than 2 or not an integer then by definition cannot be prime.
  if (n < 2) {
    return false;
  }

  if (n !== Math.round(n)) {
    return false;
  }

  // Now assume that n is prime, we will try to prove that it is not.
  let isPrime = true;

  // Now check every whole number from 2 to the square root of n.
	// If any of these divides n exactly, n cannot be prime.
  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i === 0) {isPrime = false;}
  }

  // Finally return whether n is prime or not.
  return isPrime;

}
