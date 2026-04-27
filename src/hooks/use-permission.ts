import { permissionServices } from '@/services/permission.service';
import { useQuery } from '@tanstack/react-query';


export const useFindAllPermissions = () => {
  return useQuery({
    queryKey: ['permissions'],
    queryFn: permissionServices.findAll,
  });
};
