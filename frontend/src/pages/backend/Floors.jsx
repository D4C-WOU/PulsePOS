import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Armchair, HelpCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";

import BackendLayout from "../../components/backend/BackendLayout";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import Input from "../../components/common/Input";
import Toggle from "../../components/common/Toggle";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import Spinner from "../../components/common/Spinner";
import Badge from "../../components/common/Badge";

import { 
  getFloorsApi, 
  createFloorApi, 
  updateFloorApi, 
  deleteFloorApi 
} from "../../api/floor.api";

import { 
  createTableApi, 
  updateTableApi, 
  deleteTableApi 
} from "../../api/table.api";

export const Floors = () => {
  const queryClient = useQueryClient();

  // Selected floor state
  const [selectedFloorId, setSelectedFloorId] = useState(null);

  // Modal states
  const [isFloorModalOpen, setIsFloorModalOpen] = useState(false);
  const [editingFloor, setEditingFloor] = useState(null);
  const [deletingFloorId, setDeletingFloorId] = useState(null);

  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [deletingTableId, setDeletingTableId] = useState(null);

  const { register: fRegister, handleSubmit: fSubmit, reset: fReset, formState: { errors: fErrors } } = useForm();
  const { register: tRegister, handleSubmit: tSubmit, reset: tReset, setValue: tSetValue, formState: { errors: tErrors } } = useForm();

  // Fetch Floors
  const { data: floorsData, isLoading: floorsLoading } = useQuery({
    queryKey: ["floors"],
    queryFn: getFloorsApi,
  });

  const floors = floorsData?.data || [];

  // Automatically select first floor on load
  useEffect(() => {
    if (floors.length > 0 && !selectedFloorId) {
      setSelectedFloorId(floors[0].id);
    }
  }, [floors, selectedFloorId]);

  const activeFloor = floors.find((f) => f.id === selectedFloorId);

  // Floor Mutations
  const createFloorMutation = useMutation({
    mutationFn: createFloorApi,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["floors"] });
      toast.success("Floor created successfully!");
      if (res.success && res.data) {
        setSelectedFloorId(res.data.id);
      }
      handleCloseFloorModal();
    },
    onError: (err) => {
      toast.error(err.message || "Failed to create floor");
    }
  });

  const updateFloorMutation = useMutation({
    mutationFn: ({ id, data }) => updateFloorApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["floors"] });
      toast.success("Floor name updated!");
      handleCloseFloorModal();
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update floor");
    }
  });

  const deleteFloorMutation = useMutation({
    mutationFn: deleteFloorApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["floors"] });
      toast.success("Floor and all its tables deleted!");
      setSelectedFloorId(null);
      setDeletingFloorId(null);
    },
    onError: (err) => {
      toast.error(err.message || "Failed to delete floor");
    }
  });

  // Table Mutations
  const createTableMutation = useMutation({
    mutationFn: createTableApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["floors"] });
      toast.success("Table added successfully!");
      handleCloseTableModal();
    },
    onError: (err) => {
      toast.error(err.message || "Failed to add table");
    }
  });

  const updateTableMutation = useMutation({
    mutationFn: ({ id, data }) => updateTableApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["floors"] });
      toast.success("Table updated successfully!");
      handleCloseTableModal();
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update table");
    }
  });

  const deleteTableMutation = useMutation({
    mutationFn: deleteTableApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["floors"] });
      toast.success("Table deleted!");
      setDeletingTableId(null);
    },
    onError: (err) => {
      toast.error(err.message || "Failed to delete table");
    }
  });

  // Floor handlers
  const handleOpenAddFloor = () => {
    setEditingFloor(null);
    fReset({ name: "" });
    setIsFloorModalOpen(true);
  };

  const handleOpenEditFloor = (floor) => {
    setEditingFloor(floor);
    fReset({ name: floor.name });
    setIsFloorModalOpen(true);
  };

  const handleCloseFloorModal = () => {
    setIsFloorModalOpen(false);
    setEditingFloor(null);
    fReset();
  };

  const onFloorSubmit = (data) => {
    if (editingFloor) {
      updateFloorMutation.mutate({ id: editingFloor.id, data });
    } else {
      createFloorMutation.mutate(data);
    }
  };

  // Table handlers
  const handleOpenAddTable = () => {
    setEditingTable(null);
    tReset({
      table_number: "",
      seats: 4,
      is_active: true,
    });
    setIsTableModalOpen(true);
  };

  const handleOpenEditTable = (table) => {
    setEditingTable(table);
    tReset({
      table_number: table.table_number,
      seats: table.seats,
      is_active: table.is_active,
    });
    setIsTableModalOpen(true);
  };

  const handleCloseTableModal = () => {
    setIsTableModalOpen(false);
    setEditingTable(null);
    tReset();
  };

  const onTableSubmit = (data) => {
    const payload = {
      table_number: data.table_number,
      seats: parseInt(data.seats, 10),
      is_active: !!data.is_active,
    };

    if (editingTable) {
      updateTableMutation.mutate({ id: editingTable.id, data: payload });
    } else {
      createTableMutation.mutate({ floor_id: selectedFloorId, ...payload });
    }
  };

  if (floorsLoading) {
    return (
      <BackendLayout>
        <div className="flex justify-center items-center py-40">
          <Spinner size="lg" />
        </div>
      </BackendLayout>
    );
  }

  return (
    <BackendLayout>
      <div className="flex justify-between items-center mb-6 select-none">
        <div>
          <h1 className="text-2xl font-bold text-cafe-beige-mid">Floors & Tables</h1>
          <p className="text-sm text-cafe-text-muted">Configure restaurant seat layouts and active areas</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Floors Panel */}
        <div className="lg:col-span-1 bg-cafe-bg-card border border-cafe-border p-5 rounded-lg flex flex-col gap-4 max-h-[70vh] overflow-y-auto">
          <div className="flex justify-between items-center select-none pb-2 border-b border-cafe-border/50">
            <h3 className="text-md font-bold text-cafe-text-secondary">Floors List</h3>
            <button
              onClick={handleOpenAddFloor}
              className="text-cafe-green-light hover:text-cafe-green-mid p-1 rounded hover:bg-cafe-bg-surface transition-colors"
              title="Add Floor"
            >
              <Plus size={18} />
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {floors.map((floor) => (
              <div
                key={floor.id}
                onClick={() => setSelectedFloorId(floor.id)}
                className={`group px-4 py-3 rounded-lg flex items-center justify-between cursor-pointer transition-all duration-200 ${
                  selectedFloorId === floor.id
                    ? "bg-cafe-green-mid/20 text-cafe-green-light border-l-4 border-cafe-green-mid pl-3"
                    : "text-cafe-text-muted hover:bg-cafe-bg-surface hover:text-cafe-text-secondary"
                }`}
              >
                <span className="font-semibold text-sm truncate">{floor.name}</span>
                <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenEditFloor(floor);
                    }}
                    className="p-1 rounded text-cafe-text-muted hover:text-cafe-green-dark hover:bg-cafe-bg-surface"
                  >
                    <Pencil size={12} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeletingFloorId(floor.id);
                    }}
                    className="p-1 rounded text-cafe-text-muted hover:text-cafe-danger hover:bg-cafe-border/50"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
            {floors.length === 0 && (
              <span className="text-xs text-cafe-text-muted text-center py-6">No floors created yet.</span>
            )}
          </div>
        </div>

        {/* Right Tables Panel */}
        <div className="lg:col-span-3 bg-cafe-bg-card border border-cafe-border p-6 rounded-lg min-h-[50vh]">
          {activeFloor ? (
            <>
              {/* Header */}
              <div className="flex justify-between items-center mb-6 pb-2 border-b border-cafe-border/50">
                <div>
                  <h3 className="text-lg font-bold text-cafe-text-primary">
                    Tables — {activeFloor.name}
                  </h3>
                  <p className="text-xs text-cafe-text-muted">
                    Total tables: {activeFloor.tables?.length || 0}
                  </p>
                </div>
                <Button onClick={handleOpenAddTable} className="py-1.5 px-3 text-xs">
                  <Plus size={14} /> Add Table
                </Button>
              </div>

              {/* Grid of Tables */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {activeFloor.tables && activeFloor.tables.map((table) => (
                  <div
                    key={table.id}
                    className={`relative group border rounded-lg p-4 flex flex-col items-center justify-center min-h-[110px] bg-cafe-bg-surface/30 transition-all select-none ${
                      table.is_active 
                        ? "border-cafe-border hover:border-cafe-green-mid" 
                        : "border-cafe-border/40 opacity-50"
                    }`}
                  >
                    {/* Hover edit/delete action triggers */}
                    <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
                      <button
                        onClick={() => handleOpenEditTable(table)}
                        className="p-1 rounded bg-cafe-bg-card border border-cafe-border text-cafe-text-muted hover:text-cafe-green-dark hover:bg-cafe-bg-surface hover:border-cafe-green-mid"
                        title="Edit"
                      >
                        <Pencil size={12} />
                      </button>
                      <button
                        onClick={() => setDeletingTableId(table.id)}
                        className="p-1 rounded bg-cafe-bg-card border border-cafe-border text-cafe-text-muted hover:text-cafe-danger hover:border-cafe-danger"
                        title="Delete"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>

                    <span className="text-2xl font-bold text-cafe-text-primary mb-1">
                      {table.table_number}
                    </span>

                    <div className="flex items-center gap-1 text-xs text-cafe-text-secondary">
                      <Armchair size={12} />
                      <span>{table.seats} Seats</span>
                    </div>

                    {/* Active/Inactive Badge */}
                    <div className="mt-2">
                      <Badge variant={table.is_active ? "green" : "gray"}>
                        {table.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>

                    {/* Table occupance indicator */}
                    {table.has_active_order && (
                      <span className="absolute left-2 top-2 w-2 h-2 rounded-full bg-cafe-warning" title="Occupied/In Use" />
                    )}
                  </div>
                ))}

                {(!activeFloor.tables || activeFloor.tables.length === 0) && (
                  <div className="col-span-full py-16 flex flex-col items-center justify-center text-center">
                    <HelpCircle size={36} className="text-cafe-text-muted mb-2" />
                    <span className="text-sm font-semibold text-cafe-text-secondary">No tables in this floor</span>
                    <span className="text-xs text-cafe-text-muted">Click "Add Table" to start placing layout units.</span>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center py-20 text-center select-none">
              <span className="text-md font-bold text-cafe-text-secondary">Select or Create a Floor</span>
              <span className="text-xs text-cafe-text-muted">Select a floor from the left panel to manage its seating layouts.</span>
            </div>
          )}
        </div>
      </div>

      {/* Floor Modal */}
      <Modal
        isOpen={isFloorModalOpen}
        onClose={handleCloseFloorModal}
        title={editingFloor ? "Edit Floor" : "Add Floor"}
        size="sm"
      >
        <form onSubmit={fSubmit(onFloorSubmit)} className="flex flex-col gap-4">
          <Input
            label="Floor Name *"
            placeholder="e.g. Ground Floor"
            error={fErrors.name?.message}
            {...fRegister("name", { required: "Floor name is required" })}
          />
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="ghost" onClick={handleCloseFloorModal}>
              Cancel
            </Button>
            <Button type="submit">
              {editingFloor ? "Save Changes" : "Save Floor"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Table Modal */}
      <Modal
        isOpen={isTableModalOpen}
        onClose={handleCloseTableModal}
        title={editingTable ? "Edit Table" : "Add Table"}
        size="sm"
      >
        <form onSubmit={tSubmit(onTableSubmit)} className="flex flex-col gap-4">
          <Input
            label="Table Number / Name *"
            placeholder="e.g. T1"
            error={tErrors.table_number?.message}
            {...tRegister("table_number", { required: "Table identifier is required" })}
          />

          <Input
            label="Seats Count *"
            type="number"
            placeholder="4"
            error={tErrors.seats?.message}
            {...tRegister("seats", {
              required: "Seat count is required",
              min: { value: 1, message: "Must have at least 1 seat" },
            })}
          />

          <div className="mt-2">
            <Toggle
              label="Table Enabled/Active"
              {...tRegister("is_active")}
            />
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <Button variant="ghost" onClick={handleCloseTableModal}>
              Cancel
            </Button>
            <Button type="submit">
              {editingTable ? "Save Changes" : "Save Table"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Floor Confirmation */}
      <ConfirmDialog
        isOpen={deletingFloorId !== null}
        onClose={() => setDeletingFloorId(null)}
        onConfirm={() => deleteFloorMutation.mutate(deletingFloorId)}
        title="Delete Floor?"
        message="Deleting this floor will CASCADE and permanently delete all tables configured under it. POS transactions records are preserved."
        confirmText="Delete Cascade"
        isDanger={true}
      />

      {/* Delete Table Confirmation */}
      <ConfirmDialog
        isOpen={deletingTableId !== null}
        onClose={() => setDeletingTableId(null)}
        onConfirm={() => deleteTableMutation.mutate(deletingTableId)}
        title="Delete Table?"
        message="Permanently remove this table unit? Order transactions histories associated with this table will be detached but preserved."
        confirmText="Delete Table"
        isDanger={true}
      />
    </BackendLayout>
  );
};

export default Floors;
