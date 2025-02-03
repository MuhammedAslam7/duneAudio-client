import { useToast } from "@/hooks/use-toast";

const useToaster = () => {
  const { toast } = useToast();

  return (title, description, backgroundColor) => {
    toast({
      title,
      description,
      style: {
        backgroundColor,
        color: "#fff",
      },
    });
  };
};

export { useToaster };
