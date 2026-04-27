import { authServices } from '@/services/auth.service';
import { SignInDto } from '@/shared/dtos/req/sign-in.dto';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';


// export const useSignIn = () => {
//   return useQuery({
//     queryKey: ['sign-in'],
//     queryFn: postService.fetchPosts,
//   });
// };

export const useSignIn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    // 
    mutationFn: (payload: SignInDto) => authServices.signIn(payload),
    
    // 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sign-in'] });
    },
  });
};