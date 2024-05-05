interface ProjectListItemProps {
  name: string;
}

const ProjectListItem = ({ name }: ProjectListItemProps) => {
  return (
    <span className="border-r border-neutrals-dark-200 pr-2 last:border-0">
      {name}
    </span>
  );
};

export default ProjectListItem;
