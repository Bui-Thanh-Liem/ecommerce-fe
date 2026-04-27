import { staffServices } from '@/services/staff.service';
import { CreateStaffDto } from '@/shared/dtos/req/create-staff.dto';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';


export const useFindAllStaff = () => {
  return useQuery({
    queryKey: ['staffs'],
    queryFn: staffServices.findAll,
  });
};

export const useCreateStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    // 
    mutationFn: (payload: CreateStaffDto) => staffServices.create(payload),
    
    // 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staffs'] });
    },
  });
};