export function createComment(username: string, message: string) {
  return {
    'author': {
      'username': username
    },
    'message': message
  };
}
