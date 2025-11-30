import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;

  connect() {
    if (!this.socket) {
      this.socket = io('http://localhost:3001');
      
      this.socket.on('connect', () => {
        console.log('Connected to server');
      });

      this.socket.on('disconnect', () => {
        console.log('Disconnected from server');
      });
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Consultation methods
  joinConsultation(consultationId: string) {
    if (this.socket) {
      this.socket.emit('join-consultation', consultationId);
    }
  }

  sendMessage(consultationId: string, message: string, senderId: string, senderType: 'patient' | 'doctor') {
    if (this.socket) {
      this.socket.emit('send-message', {
        consultationId,
        message,
        senderId,
        senderType
      });
    }
  }

  onNewMessage(callback: (message: any) => void) {
    if (this.socket) {
      this.socket.on('new-message', callback);
    }
  }

  onConsultationUpdated(callback: (consultation: any) => void) {
    if (this.socket) {
      this.socket.on('consultation-updated', callback);
    }
  }

  // Doctor status methods
  setDoctorOnline(doctorId: string) {
    if (this.socket) {
      this.socket.emit('doctor-online', doctorId);
    }
  }

  setDoctorOffline(doctorId: string) {
    if (this.socket) {
      this.socket.emit('doctor-offline', doctorId);
    }
  }

  onDoctorStatusChanged(callback: (data: { doctorId: string; isOnline: boolean }) => void) {
    if (this.socket) {
      this.socket.on('doctor-status-changed', callback);
    }
  }

  onNewConsultation(callback: (consultation: any) => void) {
    if (this.socket) {
      this.socket.on('new-consultation', callback);
    }
  }

  // Remove listeners
  removeAllListeners() {
    if (this.socket) {
      this.socket.removeAllListeners();
    }
  }
}

export const socketService = new SocketService();
export default socketService;