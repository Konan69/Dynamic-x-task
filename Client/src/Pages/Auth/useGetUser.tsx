// import { useState } from "react";
// import { getAuthRequest } from "../../lib/apiClient";
// import { useQuery } from "@tanstack/react-query";
// import toast from "react-hot-toast";
// import { User } from "@/types";

// const useGetUser = () => {
//   const [] = useState<User>();

//   const fetchCustomers = async () => {
//     const url = `zikora-api/v1/admin/get_customers?page=1&limit=10`;
//     const response = await getAuthRequest(url);
//     return response.data;
//   };

//   useQuery("fetchCustomers", fetchCustomers, {
//     // refetchOnWindowFocus: false,
//     // keepPreviousData: true,
//     onSuccess: (data) => {
//       setCustomersData(data);
//     },
//     onError: () => {
//       toast.error("error fetching customer data");
//     },
//   });
//   return { customersData  };
// };

// export default useFetchCustomer;
