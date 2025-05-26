import React from "react";
import { X, Calendar, Clock, MapPin, Users, DollarSign, BookOpen } from "lucide-react";
import { IAppointment, AppointmentType } from "@/app/types/appointment.contract";
import { ICourse } from "@/app/types/course.contract";

interface ViewAppointmentModalProps {
  appointment: IAppointment | null;
  isOpen: boolean;
  onClose: () => void;
}

const getAppointmentTimes = (appointment: IAppointment) => {
  const date = new Date(appointment.date);
  let startTime = new Date(date);
  let endTime = new Date(date);

  switch (appointment.appointmentType) {
    case AppointmentType.HALF_DAY_MORNING:
      startTime.setHours(8, 0, 0, 0);
      endTime.setHours(12, 0, 0, 0);
      break;
    case AppointmentType.HALF_DAY_AFTERNOON:
      startTime.setHours(13, 0, 0, 0);
      endTime.setHours(17, 0, 0, 0);
      break;
    case AppointmentType.FULL_DAY:
      startTime.setHours(8, 0, 0, 0);
      endTime.setHours(17, 0, 0, 0);
      break;
  }

  return { startTime, endTime };
};

const ViewAppointmentModal: React.FC<ViewAppointmentModalProps> = ({ appointment, isOpen, onClose }) => {
  if (!isOpen || !appointment) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 animate-slideIn">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-neutral-900">Appointment Details</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors p-2 hover:bg-gray-100 rounded-full"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-neutral-900">
                  {(appointment.courseId as unknown as ICourse).title}
                </h3>
                <p className="text-sm text-gray-500">Course Appointment</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="w-5 h-5 text-gray-500" />
                  <label className="text-sm font-medium text-gray-500">Time</label>
                </div>
                {(() => {
                  const { startTime, endTime } = getAppointmentTimes(appointment);
                  return (
                    <>
                      <p className="text-base text-neutral-900">
                        {startTime.toLocaleTimeString()} - {endTime.toLocaleTimeString()}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">{new Date(appointment.date).toLocaleDateString()}</p>
                    </>
                  );
                })()}
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-5 h-5 text-gray-500" />
                  <label className="text-sm font-medium text-gray-500">Max Participants</label>
                </div>
                <p className="text-base text-neutral-900">{appointment.maxParticipants}</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <DollarSign className="w-5 h-5 text-gray-500" />
                  <label className="text-sm font-medium text-gray-500">Price</label>
                </div>
                <p className="text-base text-neutral-900">
                  $
                  {appointment.appointmentType === AppointmentType.HALF_DAY_MORNING ||
                  appointment.appointmentType === AppointmentType.HALF_DAY_AFTERNOON
                    ? "1495"
                    : "1995"}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <BookOpen className="w-5 h-5 text-gray-500" />
                  <label className="text-sm font-medium text-gray-500">Course</label>
                </div>
                <p className="text-base text-neutral-900">{(appointment.courseId as unknown as ICourse).title}</p>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg mt-4">
              <div className="flex items-center gap-3 mb-3">
                <MapPin className="w-5 h-5 text-gray-500" />
                <h3 className="text-lg font-medium text-neutral-900">Location Details</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <label className="text-sm font-medium text-gray-500 w-32">Venue:</label>
                  <p className="text-base text-neutral-900 flex-1">{appointment.location.venueName}</p>
                </div>
                <div className="flex items-start gap-3">
                  <label className="text-sm font-medium text-gray-500 w-32">Full Address:</label>
                  <p className="text-sm text-gray-600 flex-1">
                    {appointment.location.venueName}, {appointment.location.streetAddress}, {appointment.location.city},
                    {appointment.location.state}, {appointment.location.zipCode}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <label className="text-sm font-medium text-gray-500 w-32">Address:</label>
                  <p className="text-sm text-gray-600 flex-1">{appointment.location.streetAddress}</p>
                </div>
                <div className="flex items-start gap-3">
                  <label className="text-sm font-medium text-gray-500 w-32">City:</label>
                  <p className="text-sm text-gray-600 flex-1">{appointment.location.city}</p>
                </div>
                <div className="flex items-start gap-3">
                  <label className="text-sm font-medium text-gray-500 w-32">State:</label>
                  <p className="text-sm text-gray-600 flex-1">{appointment.location.state}</p>
                </div>
                <div className="flex items-start gap-3">
                  <label className="text-sm font-medium text-gray-500 w-32">ZIP Code:</label>
                  <p className="text-sm text-gray-600 flex-1">{appointment.location.zipCode}</p>
                </div>

                {appointment.location.additionalInfo && (
                  <div className="flex items-start gap-3">
                    <label className="text-sm font-medium text-gray-500 w-32">Additional Info:</label>
                    <p className="text-sm text-gray-600 flex-1">{appointment.location.additionalInfo}</p>
                  </div>
                )}
                {appointment.location.coordinates && (
                  <div className="flex items-start gap-3">
                    <label className="text-sm font-medium text-gray-500 w-32">Directions:</label>
                    <a
                      href={`https://www.google.com/maps?q=${appointment.location.coordinates.latitude},${appointment.location.coordinates.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm text-orange-500 hover:text-orange-600"
                    >
                      <MapPin className="w-4 h-4 mr-1" />
                      View on Map
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewAppointmentModal;
