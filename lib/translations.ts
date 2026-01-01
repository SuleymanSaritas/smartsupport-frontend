export type Language = "en" | "tr";

export const translations = {
  en: {
    dashboard: {
      title: "Dashboard",
      subtitle: "Welcome to SmartSupport - AI-powered ticket classification system",
      stats: {
        totalTickets: "Total Tickets",
        activeTasks: "Active Tasks",
        successRate: "Success Rate",
        apiStatus: "API Status",
        processedTickets: "Processed tickets",
        currentlyProcessing: "Currently processing",
        classificationAccuracy: "Classification accuracy",
        backendConnection: "Backend connection",
      },
      createTicket: {
        title: "Create New Ticket",
        description: "Submit a new support ticket for AI classification",
        button: "Create Ticket",
        form: {
          textLabel: "Ticket Description",
          textPlaceholder: "Enter your support ticket description here...",
          submit: "Submit Ticket",
          cancel: "Cancel",
        },
      },
      recentActivity: {
        title: "Recent Activity",
        description: "View your recent ticket classifications",
        noActivity: "No recent activity. Create your first ticket to get started.",
      },
      results: {
        title: "Classification Results",
        language: "Language",
        topPrediction: "Top Prediction",
        allPredictions: "Top 3 Predictions",
        confidence: "Confidence",
        sanitizedText: "Sanitized Text",
        close: "Close",
      },
    },
    toast: {
      ticketCreated: "Ticket created successfully",
      ticketError: "Failed to create ticket",
      taskCompleted: "Task completed successfully",
      taskError: "Task failed",
      pollingError: "Error checking task status",
    },
  },
  tr: {
    dashboard: {
      title: "Kontrol Paneli",
      subtitle: "SmartSupport'a hoş geldiniz - AI destekli bilet sınıflandırma sistemi",
      stats: {
        totalTickets: "Toplam Bilet",
        activeTasks: "Aktif Görevler",
        successRate: "Başarı Oranı",
        apiStatus: "API Durumu",
        processedTickets: "İşlenen biletler",
        currentlyProcessing: "Şu anda işleniyor",
        classificationAccuracy: "Sınıflandırma doğruluğu",
        backendConnection: "Backend bağlantısı",
      },
      createTicket: {
        title: "Yeni Bilet Oluştur",
        description: "AI sınıflandırması için yeni bir destek bileti gönderin",
        button: "Bilet Oluştur",
        form: {
          textLabel: "Bilet Açıklaması",
          textPlaceholder: "Destek biletinizin açıklamasını buraya girin...",
          submit: "Bileti Gönder",
          cancel: "İptal",
        },
      },
      recentActivity: {
        title: "Son Aktiviteler",
        description: "Son bilet sınıflandırmalarınızı görüntüleyin",
        noActivity: "Son aktivite yok. Başlamak için ilk biletinizi oluşturun.",
      },
      results: {
        title: "Sınıflandırma Sonuçları",
        language: "Dil",
        topPrediction: "En İyi Tahmin",
        allPredictions: "En İyi 3 Tahmin",
        confidence: "Güven",
        sanitizedText: "Temizlenmiş Metin",
        close: "Kapat",
      },
    },
    toast: {
      ticketCreated: "Bilet başarıyla oluşturuldu",
      ticketError: "Bilet oluşturulamadı",
      taskCompleted: "Görev başarıyla tamamlandı",
      taskError: "Görev başarısız oldu",
      pollingError: "Görev durumu kontrol edilirken hata oluştu",
    },
  },
} as const;

export type TranslationKey = keyof typeof translations.en;

