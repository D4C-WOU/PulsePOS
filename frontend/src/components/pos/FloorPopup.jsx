import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Layers, Users as UsersIcon, Armchair, CheckCircle2 } from "lucide-react";

import Modal from "../common/Modal";
import Spinner from "../common/Spinner";
import { getFloorsApi } from "../../api/floor.api";

export const FloorPopup = ({ isOpen, onClose, onSelectTable, currentTableId }) => {
  const [activeFloorId, setActiveFloorId] = useState(null);

  const { data: res, isLoading } = useQuery({
    queryKey: ["floors_pos_popup"],
    queryFn: getFloorsApi,
    enabled: isOpen,
    onSuccess: (data) => {
      if (data?.data?.length > 0 && !activeFloorId) {
        setActiveFloorId(data.data[0].id);
      }
    },
  });

  const floors = res?.data || [];
  const activeFloor = floors.find((f) => f.id === activeFloorId) || floors[0];

  React.useEffect(() => {
    if (floors.length > 0 && !activeFloorId) {
      setActiveFloorId(floors[0].id);
    }
  }, [floors, activeFloorId]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Select Dining Table"
      size="md"
    >
      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <Spinner size="md" />
        </div>
      ) : floors.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 text-cafe-text-muted">
          <Armchair size={48} className="mb-2 opacity-40" />
          <p>No dining floors or tables configured yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {/* Floor tabs */}
          <div className="flex items-center gap-2 border-b border-cafe-border pb-3 overflow-x-auto select-none">
            {floors.map((floor) => (
              <button
                key={floor.id}
                type="button"
                onClick={() => setActiveFloorId(floor.id)}
                className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg border transition-all ${
                  activeFloorId === floor.id
                    ? "bg-cafe-beige-mid text-[#1C1814] border-cafe-beige-mid shadow"
                    : "bg-cafe-bg-card text-cafe-text-secondary border-cafe-border hover:border-cafe-text-muted"
                }`}
              >
                <Layers size={14} />
                {floor.name}
              </button>
            ))}
          </div>

          {/* Tables layout grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 py-2 select-none max-h-[350px] overflow-y-auto custom-scrollbar">
            {activeFloor?.tables?.length === 0 ? (
              <div className="col-span-full py-8 text-center text-cafe-text-muted text-xs">
                No tables defined on this floor level.
              </div>
            ) : (
              activeFloor?.tables?.map((table) => {
                const isSelected = currentTableId === table.id;
                const isOccupied = table.has_active_order;

                return (
                  <button
                    key={table.id}
                    type="button"
                    onClick={() => {
                      onSelectTable(table);
                      onClose();
                    }}
                    className={`relative p-4 rounded-xl border flex flex-col justify-between items-start text-left h-28 transition-all group ${
                      isSelected
                        ? "bg-cafe-beige-mid text-[#1C1814] border-cafe-beige-mid ring-2 ring-cafe-beige-light scale-105"
                        : isOccupied
                        ? "bg-cafe-green-mid/10 text-cafe-green-light border-cafe-green-mid/50 hover:bg-cafe-green-mid/20"
                        : "bg-cafe-bg-card text-cafe-text-primary border-cafe-border hover:border-cafe-text-muted hover:bg-cafe-bg-input/50"
                    }`}
                  >
                    <div className="flex justify-between items-center w-full">
                      <span className="font-bold text-base">
                        Table {table.table_number}
                      </span>
                      {isSelected ? (
                        <CheckCircle2 size={16} className="text-[#1C1814]" />
                      ) : isOccupied ? (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-cafe-green-mid text-cafe-beige-light uppercase tracking-wider">
                          Occupied
                        </span>
                      ) : (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-cafe-bg-input text-cafe-text-muted uppercase tracking-wider">
                          Vacant
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 mt-auto text-xs opacity-80 font-medium">
                      <UsersIcon size={13} />
                      <span>{table.seats} Seats</span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </Modal>
  );
};

export default FloorPopup;
