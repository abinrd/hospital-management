import {config} from 'dotenv';

config({path:`.env.${process.env.NODE_ENV ||'development'}.local`});

export const { PORT ,
    NODE_ENV ,
    AD_NAME,
    AD_EMAIL,
    AD_PASSWORD,
    AD_ROLE,
    AD_IS_APPROVED,
    DB_URI,
    JWT_SECRET,
    JWT_EXPIRES_IN,
    SMTP_HOST,
    SMTP_PORT,SMTP_USER,
    SMTP_PASS,FROM_EMAIL,
    FRONTEND_URL }=process.env;