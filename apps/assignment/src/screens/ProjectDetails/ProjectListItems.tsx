interface ProjectListItemsProps {
  title: string;
  children: React.ReactNode | React.ReactNode[];
}

const ProjectListItems = ({ title, children }: ProjectListItemsProps) => {
  return (
    <div className="space-y-2">
      <p className="font-semibold">{title}</p>
      <div className="flex gap-2">{children}</div>
    </div>
  );
};

export default ProjectListItems;
