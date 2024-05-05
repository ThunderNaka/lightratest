import { tw } from "@lightit/shared";

interface InputsGroupProps {
  title: string;
  children: React.ReactNode | React.ReactNode[];
  containerClassName?: string;
}

const InputsGroup = ({
  title,
  children,
  containerClassName,
}: InputsGroupProps) => {
  return (
    <div className="rounded-2xl border border-neutrals-medium-200">
      <div className="border-b border-neutrals-medium-200 px-6 py-4">
        <h3 className="text-lg font-semibold text-neutrals-dark-900">
          {title}
        </h3>
      </div>
      <div className={tw("p-6", containerClassName)}>{children}</div>
    </div>
  );
};

export default InputsGroup;
