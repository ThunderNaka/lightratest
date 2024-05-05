interface CurrentAssignmentsItemProps {
  icon: React.ReactNode;
  text: string;
}

const CurrentAssignmentsItem = ({
  icon,
  text,
}: CurrentAssignmentsItemProps) => (
  <div className="flex items-center gap-1">
    {icon}
    <p className="text-xs font-medium capitalize text-primary-200">{text}</p>
  </div>
);

export default CurrentAssignmentsItem;
