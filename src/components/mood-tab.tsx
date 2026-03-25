"use client";

import { useState } from "react";
import { User } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Circle, Coffee, Briefcase, Plane, Moon, Edit3 } from "lucide-react";
import styles from "./mood-tab.module.css";

interface MoodTabProps {
  user: User;
  onStatusChange: (status: User["status"], message?: string) => void;
}

const statusOptions = [
  {
    status: "available" as const,
    label: "Disponível",
    description: "Pronto para combinar algo",
    icon: Circle,
    color: "text-accent bg-accent/10 border-accent/30",
    dotColor: "bg-accent",
  },
  {
    status: "busy" as const,
    label: "Ocupado",
    description: "Estou ocupado agora",
    icon: Briefcase,
    color: "text-destructive bg-destructive/10 border-destructive/30",
    dotColor: "bg-destructive",
  },
  {
    status: "away" as const,
    label: "Ausente",
    description: "Fui fazer uma pausa",
    icon: Plane,
    color: "text-yellow-600 bg-yellow-500/10 border-yellow-500/30",
    dotColor: "bg-yellow-500",
  },
  {
    status: "offline" as const,
    label: "Invisível",
    description: "Aparecer offline",
    icon: Moon,
    color: "text-muted-foreground bg-muted border-border",
    dotColor: "bg-muted-foreground/50",
  },
];

const quickMessages = [
  "Apetece-me um café",
  "Bora beber uma cerveja",
  "Livre o dia todo!",
  "A trabalhar até às 18h",
  "De férias",
  "Não incomodar",
];

export default function MoodTab({ user, onStatusChange }: MoodTabProps) {
  const [customMessage, setCustomMessage] = useState(user.statusMessage || "");
  const [isEditingMessage, setIsEditingMessage] = useState(false);

  const handleStatusSelect = (status: User["status"]) => {
    onStatusChange(status, customMessage);
  };

  const handleMessageSubmit = () => {
    onStatusChange(user.status, customMessage);
    setIsEditingMessage(false);
  };

  const handleQuickMessage = (message: string) => {
    setCustomMessage(message);
    onStatusChange(user.status, message);
  };

  return (
    <div className={styles.root}>
      <div className={styles.card}>
        <div className={styles.profile}>
          <div className={styles.avatarWrap}>
            <div className={styles.avatar}>
              {user.name.charAt(0)}
            </div>
            <div
              className={cn(
                styles.statusDot,
                statusOptions.find((s) => s.status === user.status)?.dotColor
              )}
            />
          </div>
          <div>
            <h2 className={styles.name}>{user.name}</h2>
            <p className={styles.statusLabel}>
              {statusOptions.find((s) => s.status === user.status)?.label}
            </p>
          </div>
        </div>

        <div className={styles.section}>
          <label className={styles.sectionLabel}>Mensagem de estado</label>
          {isEditingMessage ? (
            <div className={styles.messageEdit}>
              <input
                type="text"
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Em que estás a pensar?"
                className={styles.input}
                autoFocus
                onKeyDown={(e) => e.key === "Enter" && handleMessageSubmit()}
              />
              <button
                onClick={handleMessageSubmit}
                className={styles.saveButton}
              >
                Guardar
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditingMessage(true)}
              className={styles.messageButton}
            >
              <span className={customMessage ? styles.messageTextActive : styles.messageTextIdle}>
                {customMessage || "Adicionar mensagem de estado..."}
              </span>
              <Edit3 size={16} className={styles.messageIcon} />
            </button>
          )}
        </div>

        <div className={styles.quickMessages}>
          {quickMessages.map((message) => (
            <button
              key={message}
              onClick={() => handleQuickMessage(message)}
              className={cn(
                styles.chip,
                customMessage === message ? styles.chipActive : styles.chipIdle
              )}
            >
              {message}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.availability}>
        <h3 className={styles.availabilityTitle}>A tua disponibilidade</h3>
        <div className={styles.availabilityGrid}>
          {statusOptions.map((option) => {
            const Icon = option.icon;
            const isActive = user.status === option.status;

            return (
              <button
                key={option.status}
                onClick={() => handleStatusSelect(option.status)}
                className={cn(
                  styles.statusButton,
                  isActive ? option.color : styles.statusButtonIdle
                )}
              >
                <Icon
                  size={24}
                  className={cn(
                    styles.statusIcon,
                    !isActive && styles.statusIconIdle
                  )}
                />
                <span className={cn(!isActive && styles.statusTitleIdle)}>
                  {option.label}
                </span>
                <span className={cn(styles.statusDescription, !isActive ? styles.statusDescriptionIdle : "opacity-80")}>
                  {option.description}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className={styles.info}>
        <p>
          O teu estado ajuda os teus amigos a perceber quando estás disponível. Eles podem ver a
          tua disponibilidade e mensagem de estado quando estiverem a combinar alguma coisa.
        </p>
      </div>
    </div>
  );
}
