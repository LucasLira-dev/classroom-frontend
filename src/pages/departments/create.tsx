import { useForm } from "@refinedev/react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { CreateView } from "@/components/refine-ui/views/create-view";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";

import { Textarea } from "@/components/ui/textarea";
import { useBack, useGetIdentity } from "@refinedev/core";
import { Loader2 } from "lucide-react";
import z from "zod";
import { useNavigate } from "react-router";
import { User } from "@/types";
import { useEffect } from "react";


const departmentCreateSchema = z.object({
    name: z.string().min(3, "Department name must be at least 3 characters long"),
    code: z.string().min(3, "Department code must be at least 3 characters long"),
    description: z.string().min(5, "Description must be at least 5 characters long")
})

type DepartmentFormValues = z.infer<typeof departmentCreateSchema>;

const DepartmentsCreate = () => {
  const back = useBack();
  const navigate = useNavigate();

  const { data: currentUser, isLoading: isUserLoading } = useGetIdentity<User>();
  
    useEffect(() => {
      if (!isUserLoading && currentUser?.role === "student") {
        navigate("/departments");
      }
    }, [currentUser, isUserLoading, navigate]);

  const form = useForm({
    resolver: zodResolver(departmentCreateSchema),
    refineCoreProps: {
      resource: "departments",
      action: "create",
    },
    defaultValues: {
      name: "",
      code: "",
      description: "",
    },
  });

  const {
    refineCore: { onFinish }, //isso é usado para submeter os dados
    handleSubmit,
    formState: { isSubmitting },
    control,
  } = form;

  const onSubmit = async (values: DepartmentFormValues) => {
    try {
      await onFinish(values);
    } catch (error) {
      console.error("Error creating class:", error);
    }
  };


  if (isUserLoading || currentUser?.role === "student") {
      return (
        <CreateView className="class-view">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </CreateView>
      );
    }
  

  return (
    <CreateView className="class-view">
      <Breadcrumb />

      <h1 className="page-title">Create a Department </h1>
      <div className="intro-row">
        <p>Provide the required information below to add a department.</p>
        <Button onClick={() => back()}>Go Back</Button>
      </div>

      <Separator />

      <div className="my-4 flex items-center">
        <Card className="class-form-card">
          <CardHeader className="relative z-10">
            <CardTitle className="text-2xl pb-0 font-bold text-gradient-orange">
              Fill out form
            </CardTitle>
          </CardHeader>

          <Separator />

          <CardContent className="mt-7">
            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <FormField
                    control={control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department Name</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Computer Science"
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(value);
                            }}
                            value={field.value ?? ""}
                            name={field.name}
                            ref={field.ref}
                            onBlur={field.onBlur}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Department Code <span className="text-orange-600">*</span>
                        </FormLabel>
                        <Input
                            type="text"
                            placeholder="CS101"
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(value);
                            }}
                            value={field.value ?? ""}
                            name={field.name}
                            ref={field.ref}
                            onBlur={field.onBlur}
                          />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                <FormField
                  control={control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Brief description about the subject"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                <Button type="submit" size="lg" className="w-full">
                  {isSubmitting ? (
                    <div className="flex gap-1">
                      <span>Creating Department...</span>
                      <Loader2 className="inline-block ml-2 animate-spin" />
                    </div>
                  ) : (
                    "Create Department"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </CreateView>
  );
};

export default DepartmentsCreate;