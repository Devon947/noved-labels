// Script to handle regular backups of Supabase database
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const https = require('https');

// Configuration
const config = {
  supabaseProjectId: process.env.SUPABASE_PROJECT_ID || 'remrzuzzzsxmiumhfonq',
  supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY || 'your-service-key-here',
  backupDir: path.join(__dirname, '../backups'),
  retentionDays: 30, // How many days to keep backups
};

// Create backup directory if it doesn't exist
if (!fs.existsSync(config.backupDir)) {
  fs.mkdirSync(config.backupDir, { recursive: true });
}

/**
 * Initiates a PostgreSQL database backup from Supabase
 */
async function backupDatabase() {
  const date = new Date();
  const timestamp = date.toISOString().replace(/[:.]/g, '-');
  const backupFile = path.join(config.backupDir, `backup-${timestamp}.sql`);
  
  console.log(`Starting database backup to ${backupFile}...`);
  
  try {
    // Use Supabase API to request a database dump
    const options = {
      hostname: `${config.supabaseProjectId}.supabase.co`,
      port: 443,
      path: '/rest/v1/pg_dump',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.supabaseServiceKey}`,
        'Content-Type': 'application/json',
      }
    };
    
    const req = https.request(options, (res) => {
      if (res.statusCode === 200) {
        const fileStream = fs.createWriteStream(backupFile);
        res.pipe(fileStream);
        
        fileStream.on('finish', () => {
          console.log(`Backup complete: ${backupFile}`);
          cleanupOldBackups();
        });
      } else {
        console.error(`Failed to initiate backup. Status code: ${res.statusCode}`);
        res.on('data', (chunk) => {
          console.error(`Response: ${chunk}`);
        });
      }
    });
    
    req.on('error', (e) => {
      console.error(`Request error: ${e.message}`);
    });
    
    req.end();
  } catch (error) {
    console.error(`Backup failed: ${error.message}`);
  }
}

/**
 * Cleans up backups older than the retention period
 */
function cleanupOldBackups() {
  const now = new Date();
  const retention = config.retentionDays * 24 * 60 * 60 * 1000; // days to ms
  
  fs.readdir(config.backupDir, (err, files) => {
    if (err) {
      console.error(`Error reading backup directory: ${err.message}`);
      return;
    }
    
    files.forEach(file => {
      if (!file.startsWith('backup-')) return;
      
      const filePath = path.join(config.backupDir, file);
      const stats = fs.statSync(filePath);
      const fileAge = now - stats.mtime;
      
      if (fileAge > retention) {
        console.log(`Removing old backup: ${file}`);
        fs.unlinkSync(filePath);
      }
    });
  });
}

// Run the backup when script is executed directly
if (require.main === module) {
  backupDatabase();
}

module.exports = {
  backupDatabase,
  cleanupOldBackups
}; 