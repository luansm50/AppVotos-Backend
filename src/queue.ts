import 'dotenv/config';

import Queue from './app/lib/Queue';
import RegistrationAnalise from './app/jobs/RegistrationAnalise';

Queue.process(RegistrationAnalise.handle)