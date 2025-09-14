import React, { useState, useEffect } from "react";
import { X, Building2, User, MapPin, Mail } from "lucide-react";
import { adminService } from "../../services/adminService";
import { toast } from "react-toastify";
import LoadingSpinner from "../common/LoadingSpinner";

const NgoAssignmentModal = ({ isOpen, onClose, issue, onAssignmentComplete }) => {
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [selectedNgoId, setSelectedNgoId] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchNgos();
      // Pre-select current assigned NGO if exists
      if (issue?.assignedNgo?.id) {
        setSelectedNgoId(issue.assignedNgo.id.toString());
      } else {
        setSelectedNgoId("");
      }
    }
  }, [isOpen, issue]);

  const fetchNgos = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllNgos(0, 100); // Get all NGOs
      setNgos(response.content || response.data || response || []);
    } catch (error) {
      console.error("Error fetching NGOs:", error);
      toast.error("Failed to load NGOs");
      setNgos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async () => {
    if (!selectedNgoId && !issue?.assignedNgo?.id) {
      toast.error("Please select an NGO to assign");
      return;
    }

    try {
      setAssigning(true);
      
      if (selectedNgoId) {
        // Assign to selected NGO
        await adminService.assignIssueToNgo(issue.id, parseInt(selectedNgoId));
        toast.success("Issue assigned to NGO successfully");
      } else {
        // Unassign current NGO
        await adminService.unassignIssueFromNgo(issue.id);
        toast.success("Issue unassigned from NGO");
      }
      
      onAssignmentComplete();
      onClose();
    } catch (error) {
      console.error("Error assigning issue to NGO:", error);
      
      let errorMessage = "Failed to assign issue to NGO";
      if (error.response?.status === 403) {
        errorMessage = "Permission denied. Only administrators can assign issues to NGOs.";
      } else if (error.response?.status === 404) {
        errorMessage = "Issue or NGO not found.";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setAssigning(false);
    }
  };

  const handleUnassign = async () => {
    try {
      setAssigning(true);
      await adminService.unassignIssueFromNgo(issue.id);
      toast.success("Issue unassigned from NGO");
      onAssignmentComplete();
      onClose();
    } catch (error) {
      console.error("Error unassigning issue from NGO:", error);
      toast.error("Failed to unassign issue from NGO");
    } finally {
      setAssigning(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Assign Issue to NGO
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Issue Details:</h4>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="font-medium text-gray-900">{issue?.title}</p>
            <p className="text-sm text-gray-600 mt-1">{issue?.description}</p>
            <div className="flex items-center mt-2 text-sm text-gray-500">
              <MapPin className="h-4 w-4 mr-1" />
              <span>Category: {issue?.category}</span>
            </div>
            {issue?.assignedNgo && (
              <div className="mt-2 text-sm">
                <span className="text-gray-600">Currently assigned to: </span>
                <span className="font-medium text-blue-600">
                  {issue.assignedNgo.username || issue.assignedNgo.firstName + " " + issue.assignedNgo.lastName}
                </span>
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select NGO to Assign:
            </label>
            
            <div className="space-y-3 max-h-64 overflow-y-auto">
              <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="ngo"
                  value=""
                  checked={selectedNgoId === ""}
                  onChange={(e) => setSelectedNgoId(e.target.value)}
                  className="mr-3"
                />
                <div className="flex items-center">
                  <div className="bg-gray-100 p-2 rounded-lg mr-3">
                    <User className="h-5 w-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Unassigned</p>
                    <p className="text-sm text-gray-500">Remove current assignment</p>
                  </div>
                </div>
              </label>

              {ngos.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Building2 className="mx-auto h-12 w-12 text-gray-300 mb-2" />
                  <p>No NGOs available</p>
                  <p className="text-sm">Register NGOs first to assign issues</p>
                </div>
              ) : (
                ngos.map((ngo) => (
                  <label 
                    key={ngo.id} 
                    className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="ngo"
                      value={ngo.id}
                      checked={selectedNgoId === ngo.id.toString()}
                      onChange={(e) => setSelectedNgoId(e.target.value)}
                      className="mr-3"
                    />
                    <div className="flex items-center flex-1">
                      <div className="bg-blue-100 p-2 rounded-lg mr-3">
                        <Building2 className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {ngo.firstName && ngo.lastName ? `${ngo.firstName} ${ngo.lastName}` : ngo.username}
                        </p>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <Mail className="h-3 w-3 mr-1" />
                          <span>{ngo.email}</span>
                          {ngo.areaCode && (
                            <>
                              <span className="mx-2">•</span>
                              <span>Area: {ngo.areaCode}</span>
                            </>
                          )}
                        </div>
                        {ngo.bio && (
                          <p className="text-xs text-gray-500 mt-1 truncate">{ngo.bio}</p>
                        )}
                      </div>
                    </div>
                  </label>
                ))
              )}
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            disabled={assigning}
          >
            Cancel
          </button>
          
          {issue?.assignedNgo && (
            <button
              onClick={handleUnassign}
              disabled={assigning}
              className="px-4 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 disabled:opacity-50"
            >
              {assigning ? "Unassigning..." : "Unassign Current"}
            </button>
          )}
          
          <button
            onClick={handleAssign}
            disabled={assigning || (!selectedNgoId && !issue?.assignedNgo)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center"
          >
            {assigning ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Assigning...
              </>
            ) : (
              selectedNgoId ? "Assign" : "Update Assignment"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NgoAssignmentModal;