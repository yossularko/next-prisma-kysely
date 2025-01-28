import { useEffect, useRef } from "react";
import { useToast } from "./use-toast";
import { ActionRes } from "@/lib/types";

const useHandleActionState = <T>(
  state: ActionRes<T>,
  successMsg: (dataSuccess: T) => string,
  onSuccessFunc?: (dataSuccess: T) => void,
) => {
  const { toast } = useToast();

  const savedMessage = useRef<(dataSuccess: T) => string>(() => "");
  savedMessage.current = (dataSuccess) => {
    return successMsg(dataSuccess);
  };

  const savedOnSuccess = useRef<(dataSuccess: T) => void>(() => {});
  savedOnSuccess.current = (dataSuccess) => {
    if (onSuccessFunc) {
      onSuccessFunc(dataSuccess);
    }
  };

  useEffect(() => {
    if (state.type === "error") {
      toast({
        title: "Error",
        description: state.error.message,
        variant: "destructive",
      });
    } else if (state.type === "success") {
      const desc = savedMessage.current(state.data)
      if(desc){
        toast({
          title: "Success",
          description: desc,
        });
      }
      savedOnSuccess.current(state.data);
    }
  }, [state, toast]);
};

export default useHandleActionState;
