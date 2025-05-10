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
      const res = await axios.get('http://localhost:3000/links');
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
      await axios.put(`http://localhost:3000/links/${movedItem.id}`, {
        status: movedItem.status,
      });
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  return (
    <div className="overflow-x-auto w-full">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex space-x-4 min-w-[1200px]">
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
                    className={`flex-1 min-w-[220px] ${bgClass} p-3 rounded shadow-md`}
                  >
                    <h2 className="text-lg font-bold mb-3 text-gray-700 text-center">{status}</h2>
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
                            className="bg-white p-3 mb-3 rounded-lg border shadow flex items-start space-x-2 hover:shadow-md transition-shadow"
                          >
                            <div className="pt-1 text-gray-400">
                              <GripVertical size={16} />
                            </div>
                            <div>
                              <p className="font-semibold text-sm text-gray-900">
                                {item.candidate_name}
                              </p>
                              <p className="text-xs text-gray-600">
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
