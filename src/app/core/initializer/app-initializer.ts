import {UserService} from "../../shared/services/user.service";


export function appInitializer(userService: UserService): () => Promise<void> {
  return () => new Promise((resolve, reject) => {
    const userName: string | null = userService.getUserName();
    if(userName) {
      userService.setUserName(userName);
    }
    resolve();
  })
}
