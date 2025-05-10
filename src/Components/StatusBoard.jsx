import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { GripVertical } from 'lucide-react';

const STATUS_COLUMNS = ['Applied', 'Screening', 'Interviewing', 'Offer', 'Hired'];

const StatusBoard = () => {
  const [columns, setColumns] = useState({});

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const res = await axios.get('https://recruitflow-api-vg04.onrender.com/api/links');
      const grouped = STATUS_COLUMNS.reduce((acc, status) => {
        acc[status] = res.data.filter((item) => item.status === status);
        return acc;
      }, {});
      setColumns(grouped);
    } catch (err) {
      console.error('Failed to fetch links:', err);
    }
  };

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination || source.droppableId === destination.droppableId) return;

    const fromList = Array.from(columns[source.droppableId]);
    const toList = Array.from(columns[destination.droppableId]);

    const movedItem = fromList.find((item) => `link-${item.id}` === draggableId);
    if (!movedItem) return;

    const updatedFrom = fromList.filter((item) => `link-${item.id}` !== draggableId);
    movedItem.status = destination.droppableId;
    toList.splice(destination.index, 0, movedItem);

    setColumns({
      ...columns,
      [source.droppableId]: updatedFrom,
      [destination.droppableId]: toList,
    });

    try {
      await axios.put(`https://recruitflow-api-vg04.onrender.com/api/links/${movedItem.id}`, {
        status: movedItem.status,
      });
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  return (
    <div className="overflow-x-auto p-4 bg-gray-50 min-h-screen">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4 min-w-[1200px]">
          {STATUS_COLUMNS.map((status) => {
            const bgClass = {
              Applied: 'bg-blue-50',
              Screening: 'bg-yellow-50',
              Interviewing: 'bg-purple-50',
              Offer: 'bg-green-50',
              Hired: 'bg-gray-100',
            }[status];

            return (
              <Droppable droppableId={status} key={status}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-1 min-w-[220px] ${bgClass} p-4 rounded-xl shadow-lg`}
                  >
                    <h2 className="text-md font-bold mb-4 text-center text-gray-700 tracking-wide uppercase">
                      {status}
                    </h2>
                    {columns[status]?.map((item, index) => (
                      <Draggable
                        key={`link-${item.id}`}
                        draggableId={`link-${item.id}`}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-white p-3 mb-3 rounded-lg border border-gray-200 shadow hover:shadow-md transition-shadow cursor-move flex gap-2"
                          >
                            <div className="text-gray-400 pt-1">
                              <GripVertical size={16} />
                            </div>
                            <div>
                              <p className="font-medium text-gray-800 text-sm">
                                {item.candidate_name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {item.requisition_title}
                              </p>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
};

export default StatusBoard;