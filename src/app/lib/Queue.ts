import Queue from 'bull';
import redisConfig from '../../config/Redis';

import RegistrationAnalise from '../jobs/RegistrationAnalise';

const analiseQueue = new Queue(RegistrationAnalise.key, redisConfig);

export default analiseQueue;