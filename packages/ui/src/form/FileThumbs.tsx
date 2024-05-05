import * as Icons from "@heroicons/react/24/outline";

import { Loading } from "../common/Loading";

interface FileThumbsProps {
  files: File[];
  onClick?: () => void;
  onDelete?: (file: File) => void;
  // loadingThumbs is an array of file names that are loading
  loadingThumbs: string[];
}

export const FileThumbs = ({
  files,
  loadingThumbs,
  onDelete,
  onClick,
}: FileThumbsProps) => {
  return (
    <aside className="flex flex-col justify-end gap-2 overflow-auto">
      {files.map((file) => (
        <div
          className="border-radius mb-2 mr-2 h-max w-96 rounded border px-6 py-4"
          key={file.name}
        >
          <div className="relative flex w-full overflow-hidden">
            <button
              className="flex w-full justify-between"
              onClick={() => onClick?.()}
            >
              {file?.name}
              {onDelete && (
                <Icons.TrashIcon
                  className="h-20 w-20 cursor-pointer text-violet-500"
                  onClick={() => onDelete(file)}
                />
              )}
            </button>
            {loadingThumbs.includes(file.name) && <Loading />}
          </div>
        </div>
      ))}
    </aside>
  );
};
