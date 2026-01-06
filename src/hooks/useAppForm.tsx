import {
  createFormHook,
  createFormHookContexts,
  formOptions,
} from "@tanstack/react-form";

const { fieldContext, useFieldContext, formContext } = createFormHookContexts();

const { useAppForm, withForm, withFieldGroup } = createFormHook({
  fieldComponents: {},
  formComponents: {},
  fieldContext,
  formContext,
});
export const settingsFormOpts = formOptions({
  defaultValues: {} as TodoConfig,
});

export { useFieldContext, useAppForm, withForm, withFieldGroup };
