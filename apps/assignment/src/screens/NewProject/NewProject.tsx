import { useFieldArray, useForm } from "react-hook-form";

import { tw } from "@lightit/shared";
import { Button, HookedSelect, icons, Input, TextArea } from "@lightit/ui";

import { Breadcrumbs } from "~/components";
import { HookedRangeCalendar } from "~/components/RangeCalendar";
import { ROUTES } from "~/router";
import {
  PROJECT_STATUS_OPTIONS,
  PROJECT_TYPE_OPTIONS,
} from "~/shared.constants";
import InputsGroup from "./InputsGroup";
import TableLinks from "./TableLinks";

const NewProject = () => {
  const { register, control } = useForm();

  const { fields, remove } = useFieldArray({
    name: "urls",
    control,
  });

  const hasOnlyOneURL = fields.length == 1;

  return (
    <div className="flex grow flex-col gap-6 p-8">
      <header className="flex flex-col gap-4">
        <Breadcrumbs
          pages={[
            { name: "Home", href: ROUTES.base },
            { name: "Projects", href: ROUTES.projects.base },
            { name: "New Project", href: ROUTES.projects.newProject },
          ]}
        />

        <h1 className="text-3xl font-bold">New Project</h1>
      </header>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <InputsGroup
            title="Project Information"
            containerClassName="grid grid-cols-2 gap-6"
          >
            <HookedSelect
              id="client"
              label="Client"
              placeholder="Choose a client"
              options={[
                { value: 0, label: "A" },
                { value: 1, label: "B" },
              ]}
              autocomplete
              control={control}
            />
            <HookedSelect
              id="projectType"
              label="Project Type"
              placeholder="Select an option"
              options={PROJECT_TYPE_OPTIONS}
              control={control}
            />
            <Input
              id="name"
              label="Project Name"
              placeholder="Enter a name for the project"
              {...register("name")}
              containerClassName="col-span-2"
            />
            <TextArea
              id="description"
              label="Description"
              placeholder="The aim of this project is to..."
              {...register("description")}
              className="h-40"
              containerClassName="col-span-2"
            />
            <div className="col-span-2">
              <HookedRangeCalendar
                showLabels={true}
                control={control}
                id="dateRange"
                fromLabel="Start Date"
                toLabel="End Date"
                gap="gap-6"
              />
            </div>
          </InputsGroup>
          <InputsGroup title="Useful Links" containerClassName="space-y-6">
            <TableLinks
              title="Technologies"
              headers={["Language/Framework", "Version"]}
              hasOnlyOneURL={hasOnlyOneURL}
              action={
                <Button
                  variant="secondary"
                  size="sm"
                  right={<icons.PlusIcon />}
                >
                  Add to technologies
                </Button>
              }
            >
              {[{ id: 1, name: "" }].map((field, index) => (
                <tr
                  key={field.id}
                  className="items-center justify-center align-top even:bg-neutrals-light-200"
                >
                  <td className="py-3 pl-4">
                    <Input
                      autoComplete="off"
                      placeholder="Select a language or framework"
                      id={`urls.${index}.name`}
                      {...register(`urls.${index}.name`)}
                    />
                  </td>
                  <td className={tw("py-3 pl-4", hasOnlyOneURL && "pr-4")}>
                    <Input
                      autoComplete="off"
                      placeholder="Choose the version"
                      id={`urls.${index}.url`}
                      {...register(`urls.${index}.url`)}
                    />
                  </td>
                  {!hasOnlyOneURL && (
                    <td className="mt-4 flex h-full items-center justify-center">
                      <button
                        aria-label="Delete"
                        onClick={() => remove(index)}
                        className="rounded-lg border border-complementary-red-500 p-2 text-complementary-red-500 hover:border-complementary-red-300 hover:text-complementary-red-300"
                      >
                        <icons.TrashIcon className="h-4 w-4" strokeWidth={2} />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </TableLinks>
            <TableLinks
              title="Utilities"
              headers={["Name", "Url"]}
              hasOnlyOneURL={hasOnlyOneURL}
              action={
                <Button
                  variant="secondary"
                  size="sm"
                  right={<icons.PlusIcon />}
                >
                  Add to utilities
                </Button>
              }
            >
              {[{ id: 1, name: "" }].map((field, index) => (
                <tr
                  key={field.id}
                  className="items-center justify-center align-top even:bg-neutrals-light-200"
                >
                  <td className="py-3 pl-4">
                    <Input
                      autoComplete="off"
                      placeholder="Utility name"
                      id={`urls.${index}.name`}
                      {...register(`urls.${index}.name`)}
                    />
                  </td>
                  <td className={tw("py-3 pl-4", hasOnlyOneURL && "pr-4")}>
                    <Input
                      autoComplete="off"
                      placeholder="https://lightit.io/"
                      id={`urls.${index}.url`}
                      {...register(`urls.${index}.url`)}
                    />
                  </td>
                  {!hasOnlyOneURL && (
                    <td className="mt-4 flex h-full items-center justify-center">
                      <button
                        aria-label="Delete"
                        onClick={() => remove(index)}
                        className="rounded-lg border border-complementary-red-500 p-2 text-complementary-red-500 hover:border-complementary-red-300 hover:text-complementary-red-300"
                      >
                        <icons.TrashIcon className="h-4 w-4" strokeWidth={2} />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </TableLinks>
            <TableLinks
              title="Environments"
              headers={["Name", "Url"]}
              hasOnlyOneURL={hasOnlyOneURL}
              action={
                <Button
                  variant="secondary"
                  size="sm"
                  right={<icons.PlusIcon />}
                >
                  Add to environments
                </Button>
              }
            >
              {[{ id: 1, name: "" }].map((field, index) => (
                <tr
                  key={field.id}
                  className="items-center justify-center align-top even:bg-neutrals-light-200"
                >
                  <td className="py-3 pl-4">
                    <Input
                      autoComplete="off"
                      placeholder="Environment name"
                      id={`urls.${index}.name`}
                      {...register(`urls.${index}.name`)}
                    />
                  </td>
                  <td className={tw("py-3 pl-4", hasOnlyOneURL && "pr-4")}>
                    <Input
                      autoComplete="off"
                      placeholder="https://stage.lightlitlabs.com/"
                      id={`urls.${index}.url`}
                      {...register(`urls.${index}.url`)}
                    />
                  </td>
                  {!hasOnlyOneURL && (
                    <td className="mt-4 flex h-full items-center justify-center">
                      <button
                        aria-label="Delete"
                        onClick={() => remove(index)}
                        className="rounded-lg border border-complementary-red-500 p-2 text-complementary-red-500 hover:border-complementary-red-300 hover:text-complementary-red-300"
                      >
                        <icons.TrashIcon className="h-4 w-4" strokeWidth={2} />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </TableLinks>
          </InputsGroup>
        </div>
        <div className="col-span-1 space-y-6">
          <InputsGroup title="Project Status">
            <HookedSelect
              id="projectStatus"
              label="Status"
              placeholder="Active / Inactive / Paused"
              options={PROJECT_STATUS_OPTIONS}
              control={control}
            />
          </InputsGroup>
          <InputsGroup title="Leadership" containerClassName="space-y-6">
            <HookedSelect
              id="accountManager"
              label="Account Manager"
              placeholder="Choose a manager"
              options={[
                { value: 0, label: "A" },
                { value: 1, label: "B" },
              ]}
              autocomplete
              control={control}
            />
            <HookedSelect
              id="techLead"
              label="Tech Lead"
              placeholder="Choose a tech lead"
              options={[
                { value: 0, label: "A" },
                { value: 1, label: "B" },
              ]}
              autocomplete
              control={control}
            />
            <HookedSelect
              id="projectManager"
              label="Project Manager"
              placeholder="Choose a project manager"
              options={[
                { value: 0, label: "A" },
                { value: 1, label: "B" },
              ]}
              autocomplete
              control={control}
            />
          </InputsGroup>
          <InputsGroup title="Extra">
            <TextArea
              id="notes"
              label="Notes"
              placeholder="Type something..."
              {...register("notes")}
              className="h-32"
              containerClassName="col-span-2"
            />
          </InputsGroup>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="md">
            Cancel
          </Button>
          <Button size="md" type="submit">
            Create project
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewProject;
