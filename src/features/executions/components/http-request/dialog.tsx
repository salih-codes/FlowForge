"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
	endpoint: z.url({ message: "Please enter a valid URL" }),
	method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),
	body: z.string().optional(),
});
// .refine();

export type HttpRequestFormValues = z.infer<typeof formSchema>;
type HttpRequestDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSubmit: (values: z.infer<typeof formSchema>) => void;
	defaultValues?: Partial<HttpRequestFormValues>;
};

export const HttpRequestDialog = ({
	open,
	onOpenChange,
	onSubmit,
	defaultValues = {},
}: HttpRequestDialogProps) => {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			endpoint: defaultValues.endpoint || "",
			method: defaultValues.method || "GET",
			body: defaultValues.body || "",
		},
	});

	// eslint-disable-next-line react-hooks/incompatible-library
	const watchMethod = form.watch("method");
	const showBodyField = ["POST", "PUT", "PATCH"].includes(watchMethod);

	const handleSubmit = (values: z.infer<typeof formSchema>) => {
		onSubmit(values);
		onOpenChange(false);
	};

	useEffect(() => {
		if (open) {
			form.reset({
				endpoint: defaultValues.endpoint || "",
				method: defaultValues.method || "GET",
				body: defaultValues.body || "",
			});
		}
	}, [open, defaultValues, form]);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>HTTP Request</DialogTitle>
					<DialogDescription>
						Configure settings for the HTTP Request Node
					</DialogDescription>
				</DialogHeader>
				<div className="py-4">
					<form
						className="space-y-8 mt-4"
						onSubmit={form.handleSubmit(handleSubmit)}
					>
						<Controller
							name="method"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field
									data-invalid={fieldState.invalid}
									orientation="responsive"
								>
									<FieldLabel htmlFor="method">Method</FieldLabel>
									<Select
										name={field.name}
										value={field.value}
										onValueChange={field.onChange}
									>
										<SelectTrigger
											className="w-full"
											aria-invalid={fieldState.invalid}
										>
											<SelectValue placeholder="Select a method" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="GET">GET</SelectItem>
											<SelectItem value="POST">POST</SelectItem>
											<SelectItem value="PUT">PUT</SelectItem>
											<SelectItem value="PATCH">PATCH</SelectItem>
											<SelectItem value="DELETE">DELETE</SelectItem>
										</SelectContent>
									</Select>
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
									<FieldDescription>
										The HTTP method to use for this request
									</FieldDescription>
								</Field>
							)}
						/>

						<Controller
							name="endpoint"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor={field.name}>Endpoint URL</FieldLabel>
									<Input
										{...field}
										id={field.name}
										aria-invalid={fieldState.invalid}
										autoComplete="off"
										placeholder="https://api.example.com/products/{{httpResponse.data.id}}"
									/>
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
									<FieldDescription>
										Static URL or use {"{{variables}}"} for simple values or{" "}
										{"{{json variable}}"} to stringify objects
									</FieldDescription>
								</Field>
							)}
						/>
						{!!showBodyField && (
							<Controller
								name="body"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor="body">Request Body</FieldLabel>
										<Textarea
											{...field}
											id="body"
											aria-invalid={fieldState.invalid}
											placeholder={`
												{
													"productId": "{{httpResponse.data.id}}"
													"name": "{{httpResponse.data.name}}"
												}
												`}
											className="min-h-30 font-mono text-sm"
										/>
										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
										<FieldDescription>
											JSON with template variables. Use {"{{variables}}"} from
											simple values or {"{{json variable}}"} to stringify
											objects
										</FieldDescription>
									</Field>
								)}
							/>
						)}
						<DialogFooter className="mt-4">
							<Button type="submit">Save</Button>
						</DialogFooter>
					</form>
				</div>
			</DialogContent>
		</Dialog>
	);
};
