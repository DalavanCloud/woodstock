/*
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS HEADER.
 *
 * Copyright (c) 2007-2018 Oracle and/or its affiliates. All rights reserved.
 *
 * The contents of this file are subject to the terms of either the GNU
 * General Public License Version 2 only ("GPL") or the Common Development
 * and Distribution License("CDDL") (collectively, the "License").  You
 * may not use this file except in compliance with the License.  You can
 * obtain a copy of the License at
 * https://oss.oracle.com/licenses/CDDL+GPL-1.1
 * or LICENSE.txt.  See the License for the specific
 * language governing permissions and limitations under the License.
 *
 * When distributing the software, include this License Header Notice in each
 * file and include the License file at LICENSE.txt.
 *
 * GPL Classpath Exception:
 * Oracle designates this particular file as subject to the "Classpath"
 * exception as provided by Oracle in the GPL Version 2 section of the License
 * file that accompanied this code.
 *
 * Modifications:
 * If applicable, add the following below the License Header, with the fields
 * enclosed by brackets [] replaced by your own identifying information:
 * "Portions Copyright [year] [name of copyright owner]"
 *
 * Contributor(s):
 * If you wish your version of this file to be governed by only the CDDL or
 * only the GPL Version 2, indicate your decision by adding "[Contributor]
 * elects to include this software in this distribution under the [CDDL or GPL
 * Version 2] license."  If you don't indicate a single choice of license, a
 * recipient has the option to distribute your version of this file under
 * either the CDDL, the GPL Version 2 or to extend the choice of license to
 * its licensees as provided above.  However, if you add GPL Version 2 code
 * and therefore, elected the GPL Version 2 license, then the option applies
 * only if the new code is made subject to such option by the copyright
 * holder.
 */

package com.sun.webui.jsf.component;

import java.beans.BeanDescriptor;

import com.sun.webui.jsf.component.util.DesignUtil;
import com.sun.webui.jsf.design.CategoryDescriptors;

import com.sun.rave.designtime.Constants;
import com.sun.rave.designtime.CategoryDescriptor;

/**
 * BeanInfo for the {@link com.sun.webui.jsf.component.FileChooser} component.
 */
public class FileChooserBeanInfo extends FileChooserBeanInfoBase {
    
    protected CategoryDescriptor[] categoryDescriptors;
    
    /**
     * Default constructor.
     */
    public FileChooserBeanInfo() {
        // Add default body and parameter names to the event descriptors for the
        // valueChange event and the pseudo-event validate.
        DesignUtil.updateInputEventSetDescriptors(this);
    }              
    
    /**
     * Return the <code>BeanDescriptor</code> for this bean.
     */     
    public BeanDescriptor getBeanDescriptor() {
        BeanDescriptor beanDescriptor = super.getBeanDescriptor();
        
        // Do not allow the component to be resized.
        beanDescriptor.setValue(Constants.BeanDescriptor.RESIZE_CONSTRAINTS,
                new Integer(Constants.ResizeConstraints.NONE));        
        return beanDescriptor;
    }  
    
    protected CategoryDescriptor[] getCategoryDescriptors() {   
        // A hack to add the category descriptor for events and to ensure that
        // Events always occurs after Data. Since events are not properties,
        // they cannot be annotated with category information.
        if (categoryDescriptors == null) {
            CategoryDescriptor[] superCategoryDescriptors = super.getCategoryDescriptors();
            categoryDescriptors = new CategoryDescriptor[superCategoryDescriptors.length + 1];
            for (int i = 0, j = 0; i < superCategoryDescriptors.length; i++, j++) {
                categoryDescriptors[j] = superCategoryDescriptors[i];
                if (categoryDescriptors[j] == CategoryDescriptors.DATA)
                    categoryDescriptors[++j] = CategoryDescriptors.EVENTS;
            }
        }
        return categoryDescriptors;
    }
}
